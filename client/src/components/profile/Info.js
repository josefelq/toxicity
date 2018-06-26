<div className="row profile-info">
	<div className="col l3 some-info">
		<div className="card steam-info">
			<div className="card-image waves-effect waves-block waves-light">
				<img
					className="activator"
					src={this.state.steamInfo.avatarfull}
					alt="avatar of user"
				/>
			</div>
			<div className="card-content">
				<span className="card-title activator grey-text text-darken-4">
					{this.state.steamInfo.personaname}
					<i className="material-icons right">more_vert</i>
				</span>
				<p>Link para reportar aqui</p>
			</div>
			<div className="card-reveal">
				<span className="card-title grey-text text-darken-4">
					Stats<i className="material-icons right">close</i>
				</span>
				<p>Cule mocho</p>
			</div>
		</div>
	</div>
</div>;
